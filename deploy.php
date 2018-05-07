<?php
namespace Deployer;

require 'recipe/common.php';

set('application', 'app.furvester.org');
set('repository', 'https://github.com/Furvester/app.furvester.org.git');
set('git_tty', true);

set('allow_anonymous_stats', false);

inventory('deploy.yml');

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'npm:install',
    'npm:build',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

set('bin/npm', function () {
    return run('which npm');
});

task('npm:install', function () {
    if (has('previous_release')) {
        if (test('[ -d {{previous_release}}/node_modules ]')) {
            run('cp -R {{previous_release}}/node_modules {{release_path}}');
        }
    }
    run('cd {{release_path}} && {{bin/npm}} install');
});

task('npm:build', function () {
    run('cd {{release_path}} && {{bin/npm}} run build');
});

after('deploy:failed', 'deploy:unlock');
