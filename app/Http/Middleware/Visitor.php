<?php

namespace App\Http\Middleware;

use App\Service\Account;
use Illuminate\Http\Request;

class Visitor
{
    public function __construct(private Account $account)
    {}

    public function handle(Request $request, \Closure $next)
    {
        $this->account->record('visit', array(
            'method' => $request->method(),
            'path' => $request->path(),
        ));

        return $next($request);
    }
}
