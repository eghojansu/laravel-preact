<?php

namespace App\Models;

use App\Extended\Model;

class Uspref extends Model
{
    protected $fillable = array(
        'name',
        'content',
    );
    protected $casts = array(
        'content' => 'array',
    );
}
