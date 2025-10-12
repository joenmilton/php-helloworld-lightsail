<?php

namespace App\Sigapps;

use Illuminate\Database\Eloquent\Builder;
use Auth;

use App\Sigapps\Handlers\TypeHandlerInterface;
use App\Sigapps\Handlers\DateHandler;
use App\Sigapps\Handlers\DefaultHandler;

trait FilterableOld
{
    protected $handlers = [];

    public function __construct() {
        $this->handlers = [
            'date' => new DateHandler(),
            'default' => new DefaultHandler(),
        ];
    }

    public function scopeApplyFilter(Builder $query, $filterRules)
    {
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

    protected function applyRule(Builder $builder, $rule, $condition)
    {
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

    protected function applySingleRule(Builder $builder, $rule, $condition)
    {
        $field      = $rule['rule'];
        $operator   = $rule['operator'];
        $type       = $rule['type'];
        $value      = $this->applyFilterValue($rule);
        
       // If the field is 'owner_id' and the value is 0, use the authenticated user's ID
       $value = ($field === 'owner_id' && $rule['value'] == 0) ? Auth::id() : $value;

        switch ($type) {
            case 'date':
                switch ($operator) {
                    case 'equal':
                        $builder->{$condition === 'and' ? 'whereDate' : 'orWhereDate'}($field, '=', $value);
                        break;
                    case 'not_equal':
                        $builder->{$condition === 'and' ? 'whereDate' : 'orWhereDate'}($field, '!=', $value);
                        break;
                    case 'less':
                        $builder->{$condition === 'and' ? 'whereDate' : 'orWhereDate'}($field, '<', $value);
                        break;
                    case 'less_or_equal':
                        $builder->{$condition === 'and' ? 'whereDate' : 'orWhereDate'}($field, '<=', $value);
                        break;
                    case 'greater':
                        $builder->{$condition === 'and' ? 'whereDate' : 'orWhereDate'}($field, '>', $value);
                        break;
                    case 'greater_or_equal':
                        $builder->{$condition === 'and' ? 'whereDate' : 'orWhereDate'}($field, '>=', $value);
                        break;
                    // For between and not_between, you need to handle the array values
                    case 'between':
                        if (is_array($value) && count($value) === 2) {
                            $builder->{$condition === 'and' ? 'whereBetween' : 'orWhereBetween'}($field, $value);
                        }
                        break;
                    case 'not_between':
                        if (is_array($value) && count($value) === 2) {
                            $builder->{$condition === 'and' ? 'whereNotBetween' : 'orWhereNotBetween'}($field, $value);
                        }
                        break;
                    default:
                        // Handle other cases for dates if necessary
                        break;
                }
                break;
            default:
                switch ($operator) {
                    case 'equal':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '=', $value);
                        break;
                    case 'not_equal':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '!=', $value);
                        break;
                    case 'in':
                        $builder->{$condition === 'and' ? 'whereIn' : 'orWhereIn'}($field, $value);
                        break;
                    case 'not_in':
                        $builder->{$condition === 'and' ? 'whereNotIn' : 'orWhereNotIn'}($field, $value);
                        break;
                    case 'less':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '<', $value);
                        break;
                    case 'less_or_equal':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '<=', $value);
                        break;
                    case 'greater':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '>', $value);
                        break;
                    case 'greater_or_equal':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '>=', $value);
                        break;
                    case 'between':
                        $builder->{$condition === 'and' ? 'whereBetween' : 'orWhereBetween'}($field, $value);
                        break;
                    case 'not_between':
                        $builder->{$condition === 'and' ? 'whereNotBetween' : 'orWhereNotBetween'}($field, $value);
                        break;
                    case 'begins_with':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, 'like', $value . '%');
                        break;
                    case 'not_begins_with':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, 'not like', $value . '%');
                        break;
                    case 'contains':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, 'like', '%' . $value . '%');
                        break;
                    case 'not_contains':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, 'not like', '%' . $value . '%');
                        break;
                    case 'ends_with':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, 'like', '%' . $value);
                        break;
                    case 'not_ends_with':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, 'not like', '%' . $value);
                        break;
                    case 'is_empty':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '=', '');
                        break;
                    case 'is_not_empty':
                        $builder->{$condition === 'and' ? 'where' : 'orWhere'}($field, '!=', '');
                        break;
                    case 'is_null':
                        $builder->{$condition === 'and' ? 'whereNull' : 'orWhereNull'}($field);
                        break;
                    case 'is_not_null':
                        $builder->{$condition === 'and' ? 'whereNotNull' : 'orWhereNotNull'}($field);
                        break;
                }
                break;
        }
    }

    protected function applyFilterValue($baseRule)  {

        $type = $baseRule["type"] ?? 'default';

        // If the handler for the type exists, use it
        if (isset($this->handlers[$type])) {
            return $this->handlers[$type]->handle($baseRule);
        }

        // Use the default handler if the type-specific handler does not exist
        return $this->handlers['default']->handle($baseRule);
    }
}