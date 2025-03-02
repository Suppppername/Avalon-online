package com.hejianzhong.Personal.webConfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CustomWebMvcConfigurer implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/Avalon").setViewName("redirect:/Avalon/");
        registry.addViewController("/Avalon/").setViewName("forward:/Avalon/index.html");
        registry.addViewController("/avalon").setViewName("redirect:/Avalon/");
        registry.addViewController("/avalon/").setViewName("forward:/Avalon/index.html");
        registry.addViewController("/avalon/?????").setViewName("redirect:/Avalon/");
        registry.addViewController("/Avalon/?????").setViewName("redirect:/Avalon/");
        registry.addViewController("/Avalon/?????").setViewName("forward:/Avalon/entry.html");
        registry.addViewController("/avalon/?????").setViewName("forward:/Avalon/entry.html");

        // Add TechFusion path mappings
        registry.addViewController("/techfusion").setViewName("redirect:/techfusion/");
        registry.addViewController("/techfusion/").setViewName("forward:/TechFusion/index.html");
        registry.addViewController("/TechFusion").setViewName("redirect:/techfusion/");
        registry.addViewController("/TechFusion/").setViewName("forward:/TechFusion/index.html");

        // AdminDashboard path mappings (corrected)
        registry.addViewController("/adminDashboard").setViewName("redirect:/adminDashboard/");
        registry.addViewController("/adminDashboard/").setViewName("forward:/AdminDashboard/index.html");
        registry.addViewController("/AdminDashboard").setViewName("redirect:/adminDashboard/");
        registry.addViewController("/AdminDashboard/").setViewName("forward:/AdminDashboard/index.html");
    }
}
