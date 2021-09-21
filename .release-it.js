module.exports = {
    hooks: {
        'before:init': 'npm run compile',
        'after:release':
            'echo Successfully released ${name} v${version} to ${repo.repository}.',
    }
};
