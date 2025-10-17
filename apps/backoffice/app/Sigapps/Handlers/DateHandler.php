<?php

namespace App\Sigapps\Handlers;

use Carbon\Carbon;

class DateHandler implements TypeHandlerInterface
{
    public function handle($rule) {
        $operator   = $rule['operator'];
        $value      = $rule['value'];
        $dates      = $this->getDateRange($operator, $value);
        return $dates;
    }

    private function getDateRange($operator, $value) {

        switch ($operator) {
            case 'is':
                return $this->getDateForIs($value);
            case 'was':
                return $this->getDateForWas($value);
            case in_array($operator, ['between', 'not_between']):
                return $this->getDateBetween($value);
            default:
                $date = Carbon::parse($value)->setTimezone('UTC');
                $dateInTimezone = $date->setTimezone('Asia/Kolkata');
                $formattedDate = $dateInTimezone->format('Y-m-d H:i:s');
                return $formattedDate;
        }
    }

    private function getDateForIs($value) {
        $today = Carbon::today();
        switch ($value) {
            case 'today':
                return $today;
            case 'next_day':
                return $today->copy()->addDay();
            case 'this_week':
                return [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()];
            case 'next_week':
                return [$today->copy()->addWeek()->startOfWeek(), $today->copy()->addWeek()->endOfWeek()];
            case 'this_month':
                return [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()];
            case 'next_month':
                return [$today->copy()->addMonth()->startOfMonth(), $today->copy()->addMonth()->endOfMonth()];
            case 'this_quarter':
                return [$today->copy()->startOfQuarter(), $today->copy()->endOfQuarter()];
            case 'next_quarter':
                return [$today->copy()->addQuarter()->startOfQuarter(), $today->copy()->addQuarter()->endOfQuarter()];
            case 'this_year':
                return [$today->copy()->startOfYear(), $today->copy()->endOfYear()];
            case 'next_year':
                return [$today->copy()->addYear()->startOfYear(), $today->copy()->addYear()->endOfYear()];
            case 'last_7_days':
                return [$today->copy()->subDays(6), $today];
            case 'last_14_days':
                return [$today->copy()->subDays(13), $today];
            case 'last_30_days':
                return [$today->copy()->subDays(29), $today];
            case 'last_60_days':
                return [$today->copy()->subDays(59), $today];
            case 'last_90_days':
                return [$today->copy()->subDays(89), $today];
            case 'last_365_days':
                return [$today->copy()->subDays(364), $today];
            default:
                return null;
        }
    }

    private function getDateForWas($value) {
        $today = Carbon::today();
        switch ($value) {
            case 'yesterday':
                return $today->copy()->subDay();
            case 'last_week':
                return [$today->copy()->subWeek()->startOfWeek(), $today->copy()->subWeek()->endOfWeek()];
            case 'last_month':
                return [$today->copy()->subMonth()->startOfMonth(), $today->copy()->subMonth()->endOfMonth()];
            case 'last_quarter':
                return [$today->copy()->subQuarter()->startOfQuarter(), $today->copy()->subQuarter()->endOfQuarter()];
            case 'last_year':
                return [$today->copy()->subYear()->startOfYear(), $today->copy()->subYear()->endOfYear()];
            default:
                return null;
        }
    }

    private function getDateBetween($value) {

        $startDate = Carbon::parse($value[0])->setTimezone('UTC');
        $startDateInTimezone = $startDate->setTimezone('Asia/Kolkata');
        $formattedStartDate = $startDateInTimezone->format('Y-m-d H:i:s');

        $endDate = Carbon::parse($value[1])->setTimezone('UTC');
        $endDateInTimezone = $endDate->setTimezone('Asia/Kolkata');
        $formattedEndDate = $endDateInTimezone->format('Y-m-d H:i:s');

        return [$formattedStartDate, $formattedEndDate];
    }
    
}
