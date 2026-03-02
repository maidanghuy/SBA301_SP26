package org.example.asis03.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.example.asis03.entity.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long accessExpiresMillis;
    private final long refreshExpiresMillis;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-expires-minutes}") long accessMinutes,
            @Value("${app.jwt.refresh-expires-days}") long refreshDays
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiresMillis = accessMinutes * 60_000L;
        this.refreshExpiresMillis = refreshDays * 24L * 60L * 60_000L;
    }

    public long getAccessExpiresInSeconds() {
        return accessExpiresMillis / 1000L;
    }

    public String generateAccessToken(String email, Role role) {
        return buildToken(email, role, "access", accessExpiresMillis);
    }

    public String generateRefreshToken(String email, Role role) {
        return buildToken(email, role, "refresh", refreshExpiresMillis);
    }

    private String buildToken(String email, Role role, String type, long expiresMillis) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiresMillis);

        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .claim("type", type)
                .issuedAt(now)
                .expiration(exp)
                .signWith((javax.crypto.SecretKey) key)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public String getRole(String token) {
        Object role = parseClaims(token).get("role");
        return role == null ? null : role.toString();
    }

    public String getType(String token) {
        Object type = parseClaims(token).get("type");
        return type == null ? null : type.toString();
    }
}