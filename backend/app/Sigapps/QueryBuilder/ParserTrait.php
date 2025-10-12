<?php
namespace App\Sigapps\QueryBuilder;

trait ParserTrait
{
    /**
     * Available operators
     *
     * @var array
     */
    protected $operators = [
        'is'               => ['accept_values' => true, 'apply_to' => ['date']],
        'was'              => ['accept_values' => true, 'apply_to' => ['date']],
        'equal'            => ['accept_values' => true, 'apply_to' => ['text', 'number', 'numeric', 'date', 'radio', 'select']],
        'not_equal'        => ['accept_values' => true, 'apply_to' => ['text', 'number', 'numeric', 'date', 'select']],
        'in'               => ['accept_values' => true, 'apply_to' => ['multi-select', 'checkbox']],
        'not_in'           => ['accept_values' => true, 'apply_to' => ['multi-select']],
        'less'             => ['accept_values' => true, 'apply_to' => ['number', 'numeric', 'date']],
        'less_or_equal'    => ['accept_values' => true, 'apply_to' => ['number', 'numeric', 'date']],
        'greater'          => ['accept_values' => true, 'apply_to' => ['number', 'numeric', 'date']],
        'greater_or_equal' => ['accept_values' => true, 'apply_to' => ['number', 'numeric', 'date']],
        'between'          => ['accept_values' => true, 'apply_to' => ['number', 'numeric', 'date']],
        'not_between'      => ['accept_values' => true, 'apply_to' => ['number', 'numeric', 'date']],
        'begins_with'      => ['accept_values' => true, 'apply_to' => ['text']],
        'not_begins_with'  => ['accept_values' => true, 'apply_to' => ['text']],
        'contains'         => ['accept_values' => true, 'apply_to' => ['text']],
        'not_contains'     => ['accept_values' => true, 'apply_to' => ['text']],
        'ends_with'        => ['accept_values' => true, 'apply_to' => ['text']],
        'not_ends_with'    => ['accept_values' => true, 'apply_to' => ['text']],
        'is_empty'         => ['accept_values' => false, 'apply_to' => ['text']],
        'is_not_empty'     => ['accept_values' => false, 'apply_to' => ['text']],
        'is_null'          => ['accept_values' => false, 'apply_to' => ['text', 'number', 'numeric', 'date', 'select']],
        'is_not_null'      => ['accept_values' => false, 'apply_to' => ['text', 'number', 'numeric', 'date', 'select']],
    ];
}