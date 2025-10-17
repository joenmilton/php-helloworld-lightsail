<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\VisibilityGroup;
use App\Models\Deal;
use App\Models\Pipeline;
use App\Traits\DateRangeTrait;

class ReportController extends Controller
{
    use DateRangeTrait;
    public function getPipelineUsers(Request $request, string $pipeline) {

        $visibilityGroup = VisibilityGroup::where('visibilityable_type', Pipeline::class)
            ->where('visibilityable_id', $pipeline)
            ->first();
        if(is_null($visibilityGroup)) {
            return $this->response(null, 'Pipeline not valid', [], 400);
        }
        
        $users = $visibilityGroup->getVisibleUsers()->map(function($user) {
            return [
                'value' => $user->id,
                'label' => $user->name
            ];
        });

        $users = $users->prepend([
            'value' => '-',
            'label' => 'All Users'
        ]);

        return $this->response($users, '');
    }

    public function processDealStatusReport(Request $request) {

        $validator = Validator::make($request->all(), [
            'pipeline' => 'required|array',
            'pipeline.value' => 'required_with:pipeline|uuid|exists:pipelines,id',
            'date_range' => 'required|array',
            'date_range.value' => 'required_with:date_range|string|in:today,yesterday,this-week,last-week,this-month,last-month,this-year,last-year,custom-range',
            'custom_range' => 'required_if:date_range.value,custom-range',
            'pipeline_user' => 'required|array',
            'pipeline_user.value' => 'required_with:pipeline_user',
            'status' => 'required|array',
            'status.value' => 'required_with:status|string|in:won,1,2,3',
        ], [
            'custom_range.required_if' => 'The custom range is required'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $dateRangeValue = $request->input('date_range.value');
            $customRange    = $request->input('custom_range');
            
            $dateRange  = $this->getDateRange($dateRangeValue, $customRange);
            $from_date  = $dateRange['from_date'];
            $to_date    = $dateRange['to_date'];

            $pipeline_id = $request->input('pipeline.value');
            $pipeline_user_id = $request->input('pipeline_user.value');
            $status = $request->input('status.value');

            // Get the deal status statistics
            $totalDeals = Deal::getDealStatusStats($from_date, $to_date, $pipeline_id, $pipeline_user_id, $status, true);
            $chartData = Deal::getDealStatusStatsForChart($from_date, $to_date, $pipeline_id, $pipeline_user_id, $status);

            $totaldealRewards = Deal::getDealsRewardedStats($from_date, $to_date, $pipeline_id, $pipeline_user_id, $status, true);
            $dealRewardsChartData = Deal::getDealsRewardedStatsForChart($from_date, $to_date, $pipeline_id, $pipeline_user_id, $status);


            return $this->response([
                'chart_data' => $chartData,
                'total_deals' => $totalDeals,

                'total_deal_rewards' => $totaldealRewards,
                'deal_rewards_chart_data' => $dealRewardsChartData,
            ], 'Report generated successfully');              
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }





    public function getDealStatusReport(Request $request) {
        if(view()->exists($request->path())){
            return view($request->path());
        }
        return view('pages-404');
    }
}