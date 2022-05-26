<?php

namespace App\Extended;

use Illuminate\Database\Schema\Blueprint as SchemaBlueprint;
use Illuminate\Database\Schema\ColumnDefinition;

class Blueprint extends SchemaBlueprint
{
    public function userid(string $name = 'userid'): ColumnDefinition
    {
        return $this->audid($name, 8);
    }

    public function forid(string $name, int $length = 8, bool $nullable = true): ColumnDefinition
    {
        return $this->string($name, $length)->nullable($nullable);
    }

    public function audid(string $name = 'uniqid', int $length = 8): ColumnDefinition
    {
        return $this->string($name, $length);
    }

    public function gradeable(): ColumnDefinition
    {
        return $this->smallInteger('grade')->nullable();
    }

    public function completable(): ColumnDefinition
    {
        return $this->decimal('completion', 6, 3)->nullable();
    }

    public function treeable(int $length = 8, string $name = 'parent'): ColumnDefinition
    {
        return $this->forid($name, $length);
    }

    public function activable(string $name = 'active'): ColumnDefinition
    {
        return $this->boolean($name)->nullable();
    }

    public function describable(string $name = 'descrip'): ColumnDefinition
    {
        return $this->string($name, 255)->nullable();
    }

    public function recordable(): void
    {
        $this->string('ip', 64)->nullable();
        $this->string('agent', 255)->nullable();
        $this->json('payload')->nullable();
    }

    public function auditable(): void
    {
        $this->string('remrk', 255)->nullable();
        $this->string('creby', 8)->nullable();
        $this->string('updby', 8)->nullable();
        $this->string('delby', 8)->nullable();
        $this->timestamp('creat')->nullable();
        $this->timestamp('updat')->nullable();
        $this->timestamp('delat')->nullable();
    }
}
