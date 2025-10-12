<?php

namespace App\Traits;

use Carbon\Carbon;

trait DateRangeTrait
{
    /**
     * Get from and to dates based on date range type and custom range
     *
     * @param string $dateRangeType The type of date range (today, yesterday, etc.)
     * @param array|null $customRange Array of custom dates for custom-range type
     * @return array Returns ['from_date' => Carbon, 'to_date' => Carbon]
     */
    public function getDateRange(string $dateRangeType, ?array $customRange = null): array
    {
        $from_date = null;
        $to_date = null;

        switch ($dateRangeType) {
            case 'today':
                $from_date = Carbon::today()->startOfDay();
                $to_date = Carbon::today()->endOfDay();
                break;
                
            case 'yesterday':
                $from_date = Carbon::yesterday()->startOfDay();
                $to_date = Carbon::yesterday()->endOfDay();
                break;
                
            case 'this-week':
                $from_date = Carbon::now()->startOfWeek();
                $to_date = Carbon::now()->endOfWeek();
                break;
                
            case 'last-week':
                $from_date = Carbon::now()->subWeek()->startOfWeek();
                $to_date = Carbon::now()->subWeek()->endOfWeek();
                break;
                
            case 'this-month':
                $from_date = Carbon::now()->startOfMonth();
                $to_date = Carbon::now()->endOfMonth();
                break;
                
            case 'last-month':
                $from_date = Carbon::now()->subMonth()->startOfMonth();
                $to_date = Carbon::now()->subMonth()->endOfMonth();
                break;
                
            case 'this-year':
                $from_date = Carbon::now()->startOfYear();
                $to_date = Carbon::now()->endOfYear();
                break;
                
            case 'last-year':
                $from_date = Carbon::now()->subYear()->startOfYear();
                $to_date = Carbon::now()->subYear()->endOfYear();
                break;
                
            case 'custom-range':
                if (is_array($customRange) && count($customRange) >= 2) {
                    // Parse simple date strings (YYYY-MM-DD format)
                    $from_date = Carbon::createFromFormat('Y-m-d', $customRange[0])->startOfDay();
                    $to_date = Carbon::createFromFormat('Y-m-d', $customRange[1])->endOfDay();
                }
                break;
        }

        return [
            'from_date' => $from_date,
            'to_date' => $to_date
        ];
    }
} 