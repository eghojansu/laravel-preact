<?php

namespace App\Http\Controllers\Api;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends CrudController
{
    protected $modelKey = 'userid';

    protected function getData(Model $model = null): array
    {
        $key = $this->getModelKey();
        $data = $this->validateWith(array(
            $this->modelKey => array(
                'bail',
                'required',
                'string',
                'min:3',
                'max:8',
                'not_regex:/\\*+NEW\\*+/',
                Rule::unique($this->getModelClass(), $key)->ignore($model?->$key, $key),
            ),
            'name' => 'bail|required|string|min:3|max:32',
            'email' => 'bail|nullable|string|email',
            'password' => array(
                'bail',
                $model ? 'nullable' : 'required',
                'string',
                'min:5',
            ),
        ));
        $save = array(
            'joindt' => now(),
            'active' => 1,
            'password' => Hash::make($data['password']),
        );

        return $save + $data;
    }
}
