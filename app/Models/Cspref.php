<?php

namespace App\Models;

use App\Extended\Model;

class Cspref extends Model
{
    protected $fillable = array(
        'name',
        'content',
    );
    protected $casts = array(
        'content' => 'array',
    );
}
