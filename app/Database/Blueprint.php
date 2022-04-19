<?php

namespace App\Database;

use Illuminate\Database\Schema\Blueprint as SchemaBlueprint;
use Illuminate\Database\Schema\ColumnDefinition;

class Blueprint extends SchemaBlueprint
{
    public function auditable(string $id = null, int|null $length = 8): ColumnDefinition|null
    {
        $index = null;

        if ($id) {
            $index = $this->string($id, $length)->index();
        }

        $this->string('remark')->nullable();
        $this->string('org', 8)->nullable();
        $this->string('created_by', 8)->nullable();
        $this->string('updated_by', 8)->nullable();
        $this->string('deleted_by', 8)->nullable();
        $this->dateTime('created_at')->nullable();
        $this->dateTime('updated_at')->nullable();
        $this->dateTime('deleted_at')->nullable();

        return $index;
    }
}
