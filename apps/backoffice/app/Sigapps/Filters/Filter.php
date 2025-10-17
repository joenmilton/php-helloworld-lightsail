<?php
namespace App\Sigapps\Filters;

use App\Sigapps\Makeable;
use App\Sigapps\MetableElement;
use App\Sigapps\QueryBuilder\ParserTrait;
use Illuminate\Support\Str;

class Filter
{
    use Makeable, 
        ParserTrait,
        MetableElement;

    /**
     * Filter field/rule
     *
     * @var string
     */
    public $field;

    /**
     * Filter label
     *
     * @var string|null
     */
    public $label;

    /**
     * Filter operators
     *
     * @var array
     */
    public $filterOperators = [];

    /**
     * Exclude operators
     *
     * @var array
     */
    public $excludeOperators = [];

    /**
     * Whether to include null operators
     *
     * @var boolean
     */
    public $withNullOperators = false;

    /**
     * Query builder rule component
     *
     * @var null|string
     */
    public $component = null;

    public function __construct($field, $label = null, $operators = null)
    {
        $this->field = $field;
        $this->label = $label;

        is_array($operators) ? $this->operators($operators) : $this->determineOperators();
    }


    /**
     * Set custom operators
     *
     * @param array $operators
     *
     * @return static
     */
    public function operators(array $operators) : static
    {
        $this->filterOperators = $operators;

        return $this;
    }

    /**
     * Exclude the empty operators
     *
     * @return static
     */
    public function withoutEmptyOperators() : static
    {
        $this->withoutOperators(['is_empty', 'is_not_empty']);

        return $this;
    }

    /**
     * Exclude operators
     *
     * @param array $operator
     *
     * @return static
     */
    public function withoutOperators($operator) : static
    {
        $this->excludeOperators = is_array($operator) ? $operator : func_get_args();

        return $this;
    }



    /**
     * Auto determines the operators on initialize based on ParserTrait
     *
     * @return void
     */
    private function determineOperators()
    {
        foreach ($this->operators as $operator => $data) {
            if (in_array($this->type(), $data['apply_to'])) {
                $this->filterOperators[] = $operator;
            }
        }
    }











    /**
     * Filter type from available filter types developed for front end
     *
     * @return string|null
     */
    public function type() : ?string
    {
        return null;
    }

    /**
     * Get the filter field
     *
     * @return string
     */
    public function field()
    {
        return $this->field;
    }

    /**
     * Get the filter label
     *
     * @return string
     */
    public function label()
    {
        return $this->label;
    }

    /**
     * Get the fillter operators
     *
     * @return array
     */
    protected function getOperators()
    {
        $operators = array_unique($this->filterOperators);

        if ($this->withNullOperators === false) {
            $operators = array_diff($operators, ['is_null', 'is_not_null']);
        }

        return array_values(
            array_diff(
                $operators,
                $this->excludeOperators
            )
        );
    }


    /**
     * Get operators options
     *
     * @return array
     */
    protected function operatorsOptions()
    {
        $options = [];
        foreach ($this->getOperators() as $operator) {
            $method = Str::studly(str_replace('.', '_', $operator)) . 'OperatorOptions';

            if (method_exists($this, $method)) {
                $options[$operator] = $this->{$method}() ?: [];
            }
        }

        return $options;
    }

    /**
     * Get the filter component
     *
     * @return string
     */
    public function component() : string
    {
        return $this->component ? $this->component : $this->type() . '-rule';
    }


    /**
     * jsonSerialize
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return array_merge([
            'id'                => $this->field(),
            'label'             => trans($this->label()),
            'type'              => $this->type(),
            'operators'         => $this->getOperators(),
            'operatorsOptions'  => $this->operatorsOptions(),
            'component'         => $this->component(),
        ], $this->meta());
    }
}