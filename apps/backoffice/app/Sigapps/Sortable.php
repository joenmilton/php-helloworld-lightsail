<?php

namespace App\Sigapps;

use Illuminate\Database\Eloquent\Builder;
use Auth;

trait Sortable
{
    public function scopeApplySort(Builder $query, $sortRequest, $action = '') {
 
        if ( !isset($sortRequest['sortOrder']) || is_null($sortRequest['sortOrder']) || $sortRequest['sortOrder'] === '' || empty($sortRequest['sortOrder']))  {
            
            if($action === 'deals') {
                return $query->orderByRaw("
                    CASE 
                        WHEN deals.status = 1 THEN 1
                        WHEN deals.status = 2 THEN 2
                        ELSE 3
                    END
                ")
                ->orderBy('deals.expected_close_date', 'asc');
            }

            if($action === 'payments') {
                return $query->orderBy('payments.created_at', 'desc');
            }

            if($action === 'activities') {
                return $query->orderByRaw("
                    CASE 
                        WHEN activities.completed = 0 THEN 0
                        ELSE 1
                    END
                ") // Ensure completed = 0 comes first
                ->orderByRaw("
                    CASE 
                        WHEN activities.completed = 0 THEN activities.end_time
                    END ASC
                ")
                ->orderByRaw("
                    CASE 
                        WHEN activities.completed = 1 THEN activities.end_time
                    END DESC
                ");
            }

            if($action === 'papers') {

            }
        }


        if(isset($sortRequest['sortOrder']) && $sortRequest['sortOrder'] !== '') {
            $sortOrder = $sortRequest['sortOrder'];
            list($sortColumn, $sortDirection) = explode(',', $sortOrder);

            $sortDirection = strtolower($sortDirection) === 'desc' ? 'desc' : 'asc';

            return $query->orderBy($sortColumn, $sortDirection);
        }

        return $query;
    }
}