<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Timeline;
use App\Models\Deal;

class ActivityLogController extends Controller
{
    public function getTimeline(Request $request, $id) {
        if ($request->ajax()) {
            try {
                $deal           = Deal::with('parentDeal')->find($id);
                $parentDealId   = (!is_null($deal->parentDeal) && isset($deal->parentDeal->id)) ? $deal->parentDeal->id : null;

                $commonLogDescriptions = [
                    // 'product_change', 
                    // 'payment_changed', 
                    // 'payment_status', 
                    // 'journal_change', 
                    // 'journal_status',
                    // 'contact_attach',
                    // 'contact_detach'
                ];

                $logsQuery = Timeline::where(function ($query) use ($deal, $parentDealId, $commonLogDescriptions) {
                    // Logs directly related to the deal
                    $query->where('subject_id', $deal->id)
                        ->where('subject_type', Deal::class);

                    // Logs related to the parent deal (if parent exists) for specific descriptions
                    if ($parentDealId) {
                        $query->orWhere(function ($subQuery) use ($deal, $parentDealId, $commonLogDescriptions) {
                            $subQuery->where('subject_id', $parentDealId)
                                    ->where('subject_type', Deal::class)
                                    ->whereIn('description', $commonLogDescriptions)
                                    ->where('created_at', '>=', $deal->created_at);
                        });
                    }
                });

                // Execute the query and get the results
                $activityLogs = $logsQuery->orderBy('updated_at', 'DESC')
                    ->paginate($request->per_page);

                return $this->response($activityLogs, '');
            } catch (\Exception $e) {
                return $this->response(null, 'Something went wrong', [], 400);
            }
        }
    }
}