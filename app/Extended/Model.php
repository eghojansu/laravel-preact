<?php

namespace App\Extended;

use App\Extension\AuditableTrait;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class Model extends EloquentModel
{
    use SoftDeletes, AuditableTrait;

    const CREATED_AT = 'creat';
    const UPDATED_AT = 'updat';
    const DELETED_AT = 'delat';

    public function getTable()
    {
        return $this->table ?? strtolower(cname(static::class));
    }
}
