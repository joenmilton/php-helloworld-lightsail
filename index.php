<?php

declare(strict_types=1);

class HelloWorld
{
    public function __construct(
        private readonly string $message = "Hello, World!"
    ) {}

    public function greet(): string
    {
        return $this->message;
    }
}

$hello = new HelloWorld();
echo $hello->greet() . PHP_EOL;
echo "PHP Version: " . PHP_VERSION . PHP_EOL;