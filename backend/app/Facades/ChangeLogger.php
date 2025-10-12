<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;
use App\Models\Deal;
use App\Models\User;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\ActivityLogger as BaseActivityLogger;
use Spatie\Activitylog\Traits\LogsActivity;
use Auth;

use App\Models\Pipeline;
use App\Models\PipelineStage;
use App\Models\Billable;
use App\Models\Payment;
use App\Models\Journal;

class ChangeLogger extends Facade
{
    /**
     * Log activity on the given model
     *
     * @param string $event
     * @param \Illuminate\Database\Eloquent\Model $subject
     * @param array $properties
     * @param \Illuminate\Database\Eloquent\Model|null $causer
     * @return \Spatie\Activitylog\Models\Activity
     */
    public static function log(string $event, $subject, array $properties = [], $causer = null): Activity
    {
        return static::getActivityLogger()->performedOn($subject)
            ->withProperties($properties)
            ->causedBy($causer)
            ->log($event);
    }

    /**
     * Get the activity logger instance
     *
     * @return \Spatie\Activitylog\ActivityLogger
     */
    protected static function getActivityLogger(): BaseActivityLogger
    {
        return activity();
    }

    public static function logStageChangeActivity(Deal $deal, PipelineStage $stage, User $causer = null): Activity {
        $properties = [
            'lang' => [
                'key' => 'deal.timeline.stage_changed',
                'attrs' => [
                    'previous' => $stage->name,
                    'stage'    => $deal->stage->name,
                ]
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log("stage_change", $deal, $properties, $causer);
    }

    public static function logProductChangeActivity(Deal $deal, $billableData, User $causer = null): Activity {
        $properties = [
            'lang' => [
                'key' => 'deal.timeline.product',
                'attrs' => $billableData,
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log("product_change", $deal, $properties, $causer);
    }

    
    public static function logPaymentChangeActivity(Deal $deal, Payment $payment, User $causer = null, $type = 'payment_change'): Activity {
        $properties = [
            'lang' => [
                'key' => ($type === 'payment_change') ? 'deal.timeline.payment' : 'deal.timeline.payment_status',
                'attrs' => $payment->only(['id', 'status', 'paid_at', 'description', 'paid_amount', 'payable_type', 'payable_id', 'status_label']),
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log($type, $deal, $properties, $causer);
    }

    public static function logJournalChangeActivity(Deal $deal, Journal $journal, User $causer = null, $type = 'journal_change'): Activity {
        $properties = [
            'lang' => [
                'key' => ($type === 'journal_change') ? 'deal.timeline.journal' : 'deal.timeline.journal_status',
                'attrs' => $journal->only(['journalable_id', 'journalable_type', 'name', 'status']),
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log($type, $deal, $properties, $causer);
    }
    

    public static function logContactChangeActivity(Deal $deal, User $contact, User $causer = null, $type = 'contact_attach'): Activity {
        $properties = [
            'lang' => [
                'key' => ($type === 'contact_attach') ? 'deal.timeline.contact_attach' : 'deal.timeline.contact_detach',
                'attrs' => $contact->only(['name']),
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log($type, $deal, $properties, $causer);
    }

    public static function logStatusChangeActivity(Deal $deal, User $causer = null): Activity {
        $status = 'Open';
        if($deal->status === 2 ) {
            $status = 'Won';
        }
        if($deal->status === 3 ) {
            $status = 'Lost';
        }

        $properties = [
            'lang' => [
                'key' => 'deal.timeline.status_change',
                'attrs' => [
                    'status' => $status
                ]
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log("status_change", $deal, $properties, $causer);
    }

    public static function logOwnerChangeActivity(Deal $deal, User $causer = null): Activity {
        $properties = [
            'lang' => [
                'key' => 'deal.timeline.owner_change',
                'attrs' => (!is_null($deal->owner)) ? $deal->owner->only(['name']) : [],
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log('owner_change', $deal, $properties, $causer);
    }

    public static function logDealCloneActivity(Deal $deal, Pipeline $pipeline, User $causer = null): Activity {
        $properties = [
            'lang' => [
                'key' => 'deal.timeline.deal_clone',
                'attrs' => $pipeline->only(['name']),
            ],
        ];

        if(is_null($causer)) {
            $causer = Auth::user();
        }

        return static::log('deal_clone', $deal, $properties, $causer);
    }
}