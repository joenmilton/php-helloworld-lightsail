<?php

namespace App\Sigapps;

use Illuminate\Database\Eloquent\Builder;
use Auth;
use App\Sigapps\Handlers\TypeHandlerInterface;
use App\Sigapps\Handlers\DateHandler;
use App\Sigapps\Handlers\DefaultHandler;

trait Filterable
{
    protected $handlers = [];

    public function __construct() {
        $this->handlers = [
            'date' => new DateHandler(),
            'default' => new DefaultHandler(),
        ];
    }

    public function scopeApplyFilter(Builder $query, $filterRules, $action = '') {

        if(isset($filterRules['q']) && $filterRules['q'] !== '') {
            $searchQuery = $filterRules['q'];
            if($action === 'deals') {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('deals.name', 'LIKE', '%'.$searchQuery.'%')
                        ->orWhere('client.mobile', '=', $searchQuery)
                        ->orWhere('client.name', '=', $searchQuery)
                        ->orWhere('client.email', '=', $searchQuery);
                });
            }

            if($action === 'activities') {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('parent.name', 'LIKE', '%'.$searchQuery.'%')
                        ->orWhere('activities.title', 'LIKE', '%'.$searchQuery.'%');
                });
            }
            
            if($action === 'payments') {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('deals.name', 'LIKE', '%'.$searchQuery.'%')
                        ->orWhere('payments.transaction_id', '=', $searchQuery)
                        ->orWhere('contact.name', '=', $searchQuery)
                        ->orWhere('owner.name', '=', $searchQuery);
                        
                });
            }

            if($action === 'papers') {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('parent.name', 'LIKE', '%'.$searchQuery.'%')
                        ->orWhere('client.mobile', '=', $searchQuery)
                        ->orWhere('client.name', '=', $searchQuery)
                        ->orWhere('client.email', '=', $searchQuery);
                });
            }
        }

        if (!isset($filterRules['rules']['children']) || !is_array($filterRules['rules']['children'])) {
            return $query;
        }

        $condition = $filterRules['rules']['condition'] ?? 'and';

        return $query->where(function ($builder) use ($filterRules, $condition) {
            foreach ($filterRules['rules']['children'] as $rule) {
                $this->applyRule($builder, $rule, $condition);
            }
        });
    }

    protected function applyRule(Builder $builder, $rule, $condition) {
        if ($rule['type'] === 'rule') {
            $this->applySingleRule($builder, $rule['query'], $condition);
        } elseif ($rule['type'] === 'group') {
            $groupCondition = $rule['query']['condition'] ?? 'and';
            $builder->{$condition === 'and' ? 'where' : 'orWhere'}(function ($groupBuilder) use ($rule, $groupCondition) {
                foreach ($rule['query']['children'] as $childRule) {
                    $this->applyRule($groupBuilder, $childRule, $groupCondition);
                }
            });
        }
    }

    protected function applySingleRule(Builder $builder, $rule, $condition) {
        $field      = $rule['rule'];
        $operator   = $rule['operator'];
        $type       = $rule['type'];
        $value      = $this->applyFilterValue($rule);

        // If the field is 'owner_id' and the value is 0, use the authenticated user's ID
        $fieldsToCheck = [ 'deals.owner_id' ]; 
        $value = (in_array($field, $fieldsToCheck) && $rule['value'] == 0) ? Auth::id() : $value;

        if ($type === 'date') {
            $this->applyDateRule($builder, $rule, $value, $condition);
        } else {
            $this->applyDefaultRule($builder, $rule, $value, $condition);
        }
    }

    protected function applyDateRule(Builder $builder, $baseRule, $value, $condition) {
        $field      = $baseRule['rule'] ?? '';
        $operator   = $baseRule['operator'] ?? '';
        $origValue  = $baseRule['value'] ?? '';
        
        $methodMap = [
            'equal' => 'whereDate',
            'not_equal' => 'whereDate',
            'less' => 'whereDate',
            'less_or_equal' => 'whereDate',
            'greater' => 'whereDate',
            'greater_or_equal' => 'whereDate',
            'between' => 'whereBetween',
            'not_between' => 'whereNotBetween',
            'is' => [
                'today' => 'whereDate',
                'next_day' => 'whereDate',
                'this_week' => 'whereBetween',
                'next_week' => 'whereBetween',
                'this_month' => 'whereBetween',
                'next_month' => 'whereBetween',
                'this_quarter' => 'whereBetween',
                'next_quarter' => 'whereBetween',
                'this_year' => 'whereBetween',
                'next_year' => 'whereBetween',
                'last_7_days' => 'whereBetween',
                'last_14_days' => 'whereBetween',
                'last_30_days' => 'whereBetween',
                'last_60_days' => 'whereBetween',
                'last_90_days' => 'whereBetween',
                'last_365_days' => 'whereBetween'
            ],
            'was' => [
                'yesterday' => 'whereDate',
                'last_week' => 'whereBetween',
                'last_month' => 'whereBetween',
                'last_quarter' => 'whereBetween',
                'last_year' => 'whereBetween',
            ],
        ];

        $method = $methodMap[$operator] ?? null;

        if ($method) {

            if (in_array($operator, ['between', 'not_between'])) {
                if (is_array($value) && count($value) === 2) {
                    $method = $condition === 'and' ? $method : 'or' . ucfirst($method);
                    $builder->$method($field, $value);
                }
            } elseif(in_array($operator, ['is', 'was'])) {
                $method = $methodMap[$operator][$origValue] ?? null;
                if($method) {
                    $method = $condition === 'and' ? $method : 'or' . ucfirst($method);
                    $builder->$method($field, $value);
                }
            } else {
                $operatorSymbol = $this->getOperatorSymbol($operator);
                if ($this->isLikeOperator($operator)) {
                    $value = $this->applyLikeOperatorValue($operator, $value);
                }
                
                $method = $condition === 'and' ? $method : 'or' . ucfirst($method);
                $builder->$method($field, $operatorSymbol, $value);
            }
        }
    }

    protected function applyDefaultRule(Builder $builder, $baseRule, $value, $condition) {
        $field      = $baseRule['rule'] ?? '';
        $operator   = $baseRule['operator'] ?? '';

        $methodMap = [
            'equal' => 'where',
            'not_equal' => 'where',
            'in' => 'whereIn',
            'not_in' => 'whereNotIn',
            'less' => 'where',
            'less_or_equal' => 'where',
            'greater' => 'where',
            'greater_or_equal' => 'where',
            'between' => 'whereBetween',
            'not_between' => 'whereNotBetween',
            'begins_with' => 'where',
            'not_begins_with' => 'where',
            'contains' => 'where',
            'not_contains' => 'where',
            'ends_with' => 'where',
            'not_ends_with' => 'where',
            'is_empty' => 'where',
            'is_not_empty' => 'where',
            'is_null' => 'whereNull',
            'is_not_null' => 'whereNotNull'
        ];

        $method = $methodMap[$operator] ?? null;

        if ($method) {
            $method = $condition === 'and' ? $method : 'or' . ucfirst($method);
            if (in_array($operator, ['in', 'not_in', 'between', 'not_between'])) {
                $builder->$method($field, $value);
            } elseif (in_array($operator, ['is_empty', 'is_not_empty'])) {
                $value = $operator === 'is_empty' ? '' : '!=';
                $builder->$method($field, $value);
            } elseif (in_array($operator, ['is_null', 'is_not_null'])) {
                $builder->$method($field);
            } else {
                $operatorSymbol = $this->getOperatorSymbol($operator);
                if ($this->isLikeOperator($operator)) {
                    $value = $this->applyLikeOperatorValue($operator, $value);
                }
                $builder->$method($field, $operatorSymbol, $value);
            }
        }
    }

    protected function getOperatorSymbol($operator) {
        $operatorSymbols = [
            'equal' => '=',
            'not_equal' => '!=',
            'less' => '<',
            'less_or_equal' => '<=',
            'greater' => '>',
            'greater_or_equal' => '>=',
            'begins_with' => 'like',
            'not_begins_with' => 'not like',
            'contains' => 'like',
            'not_contains' => 'not like',
            'ends_with' => 'like',
            'not_ends_with' => 'not like'
        ];

        return $operatorSymbols[$operator] ?? '=';
    }

    protected function applyFilterValue($baseRule) {
        $type = $baseRule["type"] ?? 'default';

        // If the handler for the type exists, use it
        if (isset($this->handlers[$type])) {
            return $this->handlers[$type]->handle($baseRule);
        }

        // Use the default handler if the type-specific handler does not exist
        return $this->handlers['default']->handle($baseRule);
    }


    protected function isLikeOperator($operator) {
        return in_array($operator, ['begins_with', 'not_begins_with', 'contains', 'not_contains', 'ends_with', 'not_ends_with']);
    }
    
    protected function applyLikeOperatorValue($operator, $value) {
        switch ($operator) {
            case 'begins_with':
                return $value . '%';
            case 'not_begins_with':
                return $value . '%';
            case 'contains':
                return '%' . $value . '%';
            case 'not_contains':
                return '%' . $value . '%';
            case 'ends_with':
                return '%' . $value;
            case 'not_ends_with':
                return '%' . $value;
            default:
                return $value;
        }
    }
}