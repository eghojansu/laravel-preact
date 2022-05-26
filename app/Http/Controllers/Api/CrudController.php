<?php

namespace App\Http\Controllers\Api;

use App\Service\Crud;
use Illuminate\Database\Eloquent\Model;

abstract class CrudController extends Controller
{
    /** @var string */
    protected $modelKey;

    /** @var string */
    protected $modelClass;

    /** @var Crud */
    protected $crud;

    public function home()
    {
        if (request()->query->has('search')) {
            return $this->api->data($this->crud->search());
        }

        return $this->api->data($this->crud->cursor());
    }

    public function create()
    {
        $this->crud->create($this->getData());

        return $this->api->saved();
    }

    public function update($id)
    {
        $model = $this->crud->load($id);
        $model->update($this->getData($model));

        return $this->api->saved();
    }

    public function delete($id)
    {
        $model = $this->crud->load($id);
        $model->delete();

        return $this->api->deleted();
    }

    protected function init()
    {
        $this->crud = $this->createCrud();
    }

    protected function createCrud(): Crud
    {
        return new Crud($this->getModelClass(), $this->getModelKey());
    }

    protected function getData(Model $model = null): array
    {
        $data = $this->validateWith($this->getValidation($model));

        return $data;
    }

    protected function getValidation(Model $model = null): array
    {
        return array();
    }

    protected function getModelKey(): string
    {
        return $this->modelKey ?? 'id';
    }

    protected function getModelClass(): string
    {
        return $this->modelClass ?? 'App\\Models\\' . str_replace('Controller', '', cname(static::class));
    }
}
