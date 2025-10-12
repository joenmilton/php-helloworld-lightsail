<?php

namespace App\Sigapps;

trait MetableElement
{
    /**
     * Additional field meta
     *
     * @var array
     */
    public array $meta = [];

    /**
     * Get the element meta
     *
     * @return array
     */
    public function meta() : array
    {
        return $this->meta;
    }

    /**
     * Add element meta
     *
     * @param array $attributes
     *
     * @return static
     */
    public function withMeta(array $attributes) : static
    {
        $this->meta = array_merge_recursive($this->meta, $attributes);

        return $this;
    }
}
