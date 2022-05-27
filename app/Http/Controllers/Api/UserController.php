<?php

namespace App\Http\Controllers\Api;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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
            'active' => 'bail|nullable|boolean',
        ));
        $save = array(
            'joindt' => $model?->joindt ?? now(),
            'password' => $data['password'] ? Hash::make($data['password']) : $model->password,
        );

        return $save + $data;
    }

    protected function getFilter(): \Closure
    {
        return fn (Builder $query) => $query->where('userid', '<>', $this->user()->userid);
    }
}
