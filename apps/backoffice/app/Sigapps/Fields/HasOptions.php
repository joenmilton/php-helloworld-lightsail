<?php
namespace App\Sigapps\Fields;

trait HasOptions
{
    /**
     * Provided options
     *
     * @var mixed
     */
    public $options = [];

    /**
     * Add field options
     *
     * @param array|callable|Illuminate\Support\Collection|App\Innoclapps\Resources\Resource $options
     *
     * @return static
     */
    public function options(mixed $options)
    {
        if (is_callable($options)) {
            $options = call_user_func($options);
        }

        $this->options = $options;
        return $this;
    }



        /**
    * Field additional meta
    *
    * @return array
    */
    public function meta() : array {
        return array_merge([
            'options'            => $this->options,
        ], $this->meta);
    }
}