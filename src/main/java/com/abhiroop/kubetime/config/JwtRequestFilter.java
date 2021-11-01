package com.abhiroop.kubetime.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.abhiroop.kubetime.svc.IUserInfoService;

import io.jsonwebtoken.ExpiredJwtException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter{

	
	private static final Logger log = LoggerFactory.getLogger(JwtRequestFilter.class);
	
	@Autowired
	private IUserInfoService jwtUserDetailsService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		final String requestTokenHeader = request.getHeader("Authorization");

		String userEmail = null;
		String jwtToken = null;
		String jwtTokenString = null;
		if (requestTokenHeader == null && request.getHeader("Cookie") != null) {
			String[] cookies = request.getHeader("Cookie").split(";");
			if (cookies != null) {
				for (int i = 0; i < cookies.length; i++) {
					if (cookies[i].startsWith(" Bearer") || cookies[i].startsWith("Bearer")) {
						jwtTokenString = cookies[i];
						jwtToken = jwtTokenString.substring(cookies[i].indexOf('=') + 1);
						break;
					}
				}
				// JWT Token is in the form "Bearer token". Remove Bearer word and get only the
				// Token
			}
		} else {
			if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
				jwtToken = requestTokenHeader.substring(7);
			}
		}

		if (jwtToken != null) {
//			jwtToken = requestTokenHeader.substring(7);
			try {
				userEmail = jwtTokenUtil.getUsernameFromToken(jwtToken);
				log.info("recieving request from " + userEmail);
			} catch (IllegalArgumentException e) {
				System.out.println("Unable to get JWT Token");
			} catch (ExpiredJwtException e) {
				System.out.println("JWT Token has expired");
				//TODO : Throw exception and delete cookie and redirect to login Page.
			}
		} else {
			List<String> unAuthUrlsList = new ArrayList<>(Arrays.asList(SystemConstants.unAuthUrls));
			if (!request.getRequestURI().startsWith("/static") && !unAuthUrlsList.contains(request.getRequestURI()))
				logger.warn("JWT Token does not begin with Bearer String @" + request.getRequestURI());
		}

		// Once we get the token validate it.
		if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

			UserDetails userDetails = this.jwtUserDetailsService.loadUserByUsername(userEmail);

			// if token is valid configure Spring Security to manually set authentication
			if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {

				UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());
				usernamePasswordAuthenticationToken
						.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				// After setting the Authentication in the context, we specify
				// that the current user is authenticated. So it passes the Spring Security
				// Configurations successfully.
				SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			}
		}
		chain.doFilter(request, response);
	}

}
