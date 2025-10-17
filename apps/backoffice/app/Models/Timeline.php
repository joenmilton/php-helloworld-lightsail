<?php

namespace App\Models;

use Spatie\Activitylog\Models\Activity;

class Timeline extends Activity {
    
    protected $appends = ['timeline_message'];

    public function getTimelineMessageAttribute() {

        $properties = $this->properties['lang'] ?? [];

        switch ($this->description) {
            case in_array($this->description, [
                'stage_change', 
                'product_change', 
                'journal_change', 
                'journal_status', 
                'payment_change', 
                'payment_status',
                'contact_attach',
                'contact_detach',
                'status_change',
                'owner_change',
                'deal_clone'
            ]):
                return $this->translateLang($this->causer_name, $properties);
                break;

            case in_array($this->description, ['created', 'updated']):
                
                $properties['key'] = 'deal.timeline.'.$this->description;
                return $this->translateLang($this->causer_name, $properties);
                break;

            default:
                return 'sd';
                break;
        }
    }

    protected function translateLang(string $causer_name, array $langProps = []) {
        $key = $langProps['key'] ?? 'deal.timeline.created';
        $attrs = $langProps['attrs'] ?? [];
        $attrs['causer_name'] = $causer_name;


        $keysToCollect = ['causer_name', 'previous', 'stage', 'total', 'name', 'status_label', 'paid_amount', 'status'];
        $collectedValues = array_reduce($keysToCollect, function($carry, $key) use ($attrs) {
            $carry[$key] = $attrs[$key] ?? null;
            return $carry;
        }, []);

        return trans($key, $collectedValues);
    }
}