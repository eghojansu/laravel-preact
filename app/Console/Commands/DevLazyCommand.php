<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use SebastianBergmann\Timer\Timer;
use Symfony\Component\Yaml\Yaml;

class DevLazyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev:lazy {groups?*} {--e|excludes=* : Excluded actions} {--d|dry : Show steps only}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dev lazily';

    protected $data;

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->data = Yaml::parseFile(base_path('dev/data.yml'));

        if (
            $this->data['dev'] !== $this->secret('what?')
            || !$this->laravel->environment('dev', 'development', 'local')
        ) {
            return $this->call('inspire');
        }

        $time = new Timer();
        $time->start();

        $actions = $this->getActions();

        if ($this->option('dry')) {
            $this->output->writeln('Available actions:');

            array_walk($actions, fn (string $method, string $action) => (
                $this->output->writeln(sprintf(
                    '  - <info>%s</>',
                    $action,
                ))
            ));

            if (!$actions) {
                $this->output->writeln('  <comment>None</>');
            }

            return self::SUCCESS;
        }

        $success = null;
        $executed = 0;
        $total = count($actions);

        array_walk(
            $actions,
            function (string $method, string $action) use (&$success, &$executed, $total, $time) {
                if (false === $success) {
                    return;
                }

                $time->start();

                $this->separate();
                $this->output->writeln(sprintf(
                    'Running <comment>%s</> (<comment>%s</>/<comment>%s</>)',
                    $action,
                    ++$executed,
                    $total,
                ));

                $success = $this->$method() ?? true;

                $this->output->newLine();
                $this->output->writeln(sprintf(
                    '-- End running <comment>%s</> (<comment>%s</>)',
                    $action,
                    $time->stop()->asString(),
                ));
            },
        );

        list($tag, $message) = match($success) {
            true => array('info', 'Successful'),
            false => array('error', 'Failed'),
            default => array('comment', 'None executed'),
        };

        $this->output->newLine();
        $this->output->writeln(sprintf(
            'Action performed: <comment>%s</>/<comment>%s</>',
            $executed,
            $total,
        ));
        $this->output->writeln(sprintf(
            'Elapsed: <comment>%s</>',
            $time->stop()->asString(),
        ));
        $this->output->writeln(sprintf(
            'Summary Result: <%s>%s</>',
            $tag,
            $message,
        ));

        return 0;
    }

    private static function quote(array $values): string
    {
        return $values ? '(' . implode('|', array_map(
            static fn (string $val) => preg_quote($val, '/'),
            $values,
        )) . ')' : '';
    }

    private function separate(): void
    {
        $this->output->writeln(str_repeat('-', 50));
    }

    private function getActions(): array
    {
        $excludes = self::quote($this->option('excludes'));
        $groups = self::quote($this->argument('groups'));
        $start = '/^_(\d+)';
        $end = '/i';
        $includes = $groups ? $start . $groups . $end : '';
        $ignores = $excludes ? $start . $groups . $excludes . '$' . $end : '';
        $methods = get_class_methods($this);
        $actions = $includes ? (
            ($founds = preg_grep($includes, $methods)) && $ignores ?
                array_filter(
                    $founds,
                    static fn (string $method) => !preg_match(
                        $ignores,
                        $method,
                    ),
                ) :
                $founds
        ) : array();

        sort($actions);

        return array_combine(
            array_map(
                static fn (string $action) => preg_replace(
                    $start . $groups . '(\d+)' . $end,
                    '',
                    $action,
                ),
                $actions,
            ),
            $actions,
        );
    }

    private function _01Dev01CreateMigrations()
    {
        $exists = glob(database_path('migrations/*'));

        array_walk(
            $this->data['tables'],
            function(string $table) use ($exists) {
                $name = 'create_' . $table . '_table';

                if (preg_grep(
                    '/_' . preg_quote($name, '/') . '\.php$/i',
                    $exists,
                )) {
                    $this->output->writeln(
                        sprintf(
                            'Migration exists: <info>%s</>',
                            $table,
                        ),
                    );

                    return;
                }

                $this->call('make:migration', compact('name'));
            },
        );
    }

    private function _01Dev02CreateModels()
    {
        $exists = glob(app_path('Models/*'));

        array_walk(
            $this->data['tables'],
            function(string $table) use ($exists) {
                $name = ucfirst($table);

                if (preg_grep(
                    '/(\/|\\\\)' . preg_quote($name, '/') . '\.php$/i',
                    $exists,
                )) {
                    $this->output->writeln(
                        sprintf(
                            'Model exists: <info>%s</>',
                            $name,
                        ),
                    );

                    return;
                }

                $this->call('make:model', compact('name'));
            },
        );
    }
}
