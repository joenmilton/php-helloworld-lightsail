<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Deal;

class DashboardController extends Controller
{
    public function getDashboardStats(Request $request) {
        // Get year from request or use current year
        $year = $request->get('year', now()->year);
        $pipeline_id = $request->get('pipeline_id', null);

        $chartData = Deal::getDashboardStatsForChart($year, $pipeline_id);
        return $this->response($chartData, 'Dashboard stats retrieved successfully');
    }

    public function getClientDealStats(Request $request) {
        $year = $request->get('year', now()->year);
        $pipeline_id = $request->get('pipeline_id', null);

        $chartData = Deal::getClientDealStatsForChart($year, $pipeline_id);
        return $this->response($chartData, 'Client deal stats retrieved successfully');
    }

    public function getStatsCreatedVsClosed(Request $request) {
        // Get year from request or use current year
        $year = $request->get('year', now()->year);
        $pipeline_id = $request->get('pipeline_id', null);

        // Get monthly statistics
        $chartData = Deal::getCreatedVsClosedForChart($year, $pipeline_id);
        
        return $this->response($chartData, 'Created vs Closed statistics retrieved successfully');
    }



    public function getStatsByCreatedDate(Request $request) {
        // Get year from request or use current year
        $year = $request->get('year', now()->year);
        $pipeline_id = $request->get('pipeline_id', null);

        // Get chart-ready data
        $chartData = Deal::getMonthlyStatsForChart($year, $pipeline_id);

        return $this->response($chartData, 'Chart data retrieved successfully');
    }
}