package com.hejianzhong.Personal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CustomWebMvcConfigurer implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/Avalon").setViewName("redirect:/Avalon/");
        registry.addViewController("/Avalon/").setViewName("forward:/Avalon/index.html");
    }


}
