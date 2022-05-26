<?php

namespace App\Service;

use Illuminate\Database\Eloquent\Model;

class Crud
{
    const DEFAULT_KEY = '***NEW***';

    public function __construct(
        private string $modelClass,
        private string $modelKey,
        private int $perPage = 30,
    ) {}

    public function load(string $key)
    {
        $model = $this->modelClass;
        $query = $model::where($this->modelKey, $key)->limit(1);

        return $query->first();
    }

    public function create(array $data): Model
    {
        $model = $this->modelClass;
        $created = $model::create($data);

        return $created;
    }

    public function search()
    {
        $model = $this->modelClass;
        $query = $model::orderBy($this->modelKey);

        return $query->paginate($this->perPage);
    }

    public function cursor()
    {
        $model = $this->modelClass;
        $order = $this->modelKey;
        $request = request();
        $load = $request->get('load', self::DEFAULT_KEY);
        $cursor = $request->get('cursor');
        [$operation, $direction] = match($cursor) {
            'next' => array('>', 'asc'),
            'end' => array(null, 'desc'),
            'prev' => array('<', 'desc'),
            'first' => array(null, 'asc'),
            default => array('=', 'asc'),
        };
        $query = $model::orderBy($order, $direction)->limit(1);

        if ($load && (self::DEFAULT_KEY !== $load) && $operation) {
            $query->where($order, $operation, $load);
        }

        return $query->first();
    }
}
