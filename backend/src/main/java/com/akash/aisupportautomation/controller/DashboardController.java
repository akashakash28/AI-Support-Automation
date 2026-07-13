package com.akash.aisupportautomation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akash.aisupportautomation.dto.CategoryCountResponse;
import com.akash.aisupportautomation.dto.DashboardSummaryResponse;
import com.akash.aisupportautomation.dto.PriorityCountResponse;
import com.akash.aisupportautomation.dto.TeamCountResponse;
import com.akash.aisupportautomation.service.DashboardService;

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // ==========================================
    // Dashboard Summary
    // ==========================================

    @GetMapping("/dashboard/summary")
    public DashboardSummaryResponse getSummary() {

        return dashboardService.getSummary();
    }

    // ==========================================
    // Category Analytics
    // ==========================================

    @GetMapping("/dashboard/category")
    public List<CategoryCountResponse> getCategoryAnalytics() {

        return dashboardService.getCategoryAnalytics();
    }

    // ==========================================
    // Priority Analytics
    // ==========================================

    @GetMapping("/dashboard/priority")
    public List<PriorityCountResponse> getPriorityAnalytics() {

        return dashboardService.getPriorityAnalytics();
    }

    // ==========================================
    // Team Analytics
    // ==========================================

    @GetMapping("/dashboard/team")
    public List<TeamCountResponse> getTeamAnalytics() {

        return dashboardService.getTeamAnalytics();
    }

}