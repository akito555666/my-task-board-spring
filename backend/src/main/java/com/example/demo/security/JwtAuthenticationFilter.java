package com.example.demo.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, @Lazy UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        // リクエストヘッダーからJWTトークンを取得
        String token = resolveToken(request);
        
        // トークンが存在し、かつ有効である場合
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // トークンからユーザー名を取得
            String username = jwtTokenProvider.getUsername(token);
            
            // データベースからユーザー詳細情報をロード
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Spring Securityの認証トークンを作成
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
            
            // リクエスト詳細（IPアドレスなど）を認証情報にセット
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));
            
            // SecurityContextに認証情報をセット（これでログイン状態となる）
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        // 次のフィルターへ処理を委譲
        filterChain.doFilter(request, response);
    }
    
    // AuthorizationヘッダーからBearerトークンを抽出するヘルパーメソッド
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
