/*global sweetAlert, GitHub*/
(function (p_oGlobal) {
    var oSweetAlertConfig;

    // -------------------------- -------------------------- -------------------
    function debug(p_sMessage) {
        console.log(p_sMessage);
    }

    function unslug(p_sSubject) {
        return p_sSubject.
            replace('-', ' ').
            toLowerCase().
            replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            }
        );
    }

    function errorHandler(p_oError) {
        var sError;

        if (p_oError.path && p_oError.status)  {
            if (p_oError.path.split('/').pop() === 'refs')  {
                sError = 'Failed to create branch.';
                if (p_oError.status === 404) {
                    sError += '<br/>Are you sure your credentials are correct?';
                }
            }

            sError += '<pre style="white-space: pre-line; font-size: 50%;">' +
                p_oError.path + ':' + p_oError.status +
                '</pre>'
            ;
        } else {
            sError = p_oError;
        }

        console.warn(p_oError.status);
        console.warn(p_oError.path);
        console.warn(p_oError.request);
        console.warn(p_oError.response);

        sweetAlert({
            confirmButtonText: 'Try Again',
            showCancelButton: true,
            text: '' + sError,
            title: 'Could not create pull request',
            type: 'error',
        }).then(function () {
            sweetAlert(oSweetAlertConfig)
                .then(createPullRequest)
                .then(successHandler)
                .catch(errorHandler)
                ;
            }
        );
    }

    function updateContent(p_sContent) {
        var aMatch, iScore, oRegex, sContent;

        oRegex = new RegExp(this.badge + '(\\s*:\\s*)(\\d+)');
        aMatch = oRegex.exec(p_sContent);

        if (aMatch === null) {
            throw new Error('Could not find a badge for "' + this.badge + '"');
        } else {
            iScore = parseInt(aMatch[2], 10) + 1;
            sContent = p_sContent.replace(aMatch[0], this.badge + aMatch[1] + iScore);
            return sContent;
        }
    }

    function commitMessage() {
        return 'Awards ' + this.badge + ' badge to ' + unslug(this.subject) +
        "\n\n" + this.motivation
        ;
    }

    function successHandler(foo) {
        console.info(foo);
        sweetAlert({
            title: 'Pull Request Opened',
            html: 'Once at least one person supports your claim it can be awarded. You can <a href="#">follow the progress here</a>',
            type: 'success'
        });
    }

    function inputValidator(p_fResolve, p_fReject, p_oConfig, p_oCredentials) {
        debug('4. Starting input validator');
        console.log(p_oCredentials);

        if (p_oConfig === '') {
            p_fReject('You need to give a reason!');
        } else if (
            (p_oCredentials.user === '' && p_oCredentials.pass === '' && p_oCredentials.token !== '')
            || (p_oCredentials.user !== '' && p_oCredentials.pass !== '' && p_oCredentials.token === '')
        ) {
            p_fResolve(p_oConfig, p_oCredentials);
        } else {
            p_fReject('You need to give credentials (either user/pass or token)!');
        }
    }

    function createPullRequest(p_oConfig, p_oCredentials) {
        debug('5: Starting Create Pull Request');
        console.log(p_oCredentials);
        var oGithubClient, oRepo;

        oGithubClient = new GitHub(p_oCredentials);
        oRepo = oGithubClient.getRepo(
            p_oConfig.target.repo.split('/')[0],
            p_oConfig.target.repo.split('/')[1]
        );

        return p_oGlobal.openPullRequest(p_oConfig, oRepo);
    }

    function preConfirm(p_oConfig, p_oDocument) {
        debug('3. Starting preConfirm');
        var oCredentials;

        p_oConfig.data.motivation = p_oDocument.querySelector('[name="motivation"]').value;

        oCredentials = {
            'user': p_oDocument.querySelector('[name="user"]').value,
            'pass': p_oDocument.querySelector('[name="pass"]').value,
            'token': p_oDocument.querySelector('[name="token"]').value
        };

        return new Promise(function (p_fResolve, p_fReject) {
            return inputValidator(p_fResolve, p_fReject, p_oConfig, oCredentials);
        });
    }

    function createRequestForm () {
        var sHtml = '' +
            '<input required autofocus class="swal2-input" name="motivation" placeholder="Reason to award badge" type="text">' +
            '<input class="swal2-input" name="user" placeholder="Github User Name" type="text">' +
            '<input class="swal2-input" name="pass" placeholder="********" type="password">' +
            '<span class="alternate">or</span>' +
            '<input class="swal2-input" name="token" placeholder="Github API Token" type="text">'
        ;
        return sHtml;
    }

    function clickHandler(p_oConfig, p_oDocument, p_oElement) {
        debug('1. CLicked');

        p_oConfig.data.badge = p_oElement.attributes['data-badge'].value;
        p_oConfig.target.path = p_oElement.attributes['data-page'].value;
        p_oConfig.data.subject =  p_oElement.attributes['data-user'].value;

        oSweetAlertConfig = {
            allowOutsideClick: false,
            html: createRequestForm(),
            inputValidator: function (p_bResult) {
                debug('?? inputValidator triggerd');
                console.log(p_bResult);
                return new Promise(function (p_fResolve, p_fReject, p_oConfig, p_oCredentials) {
                    debug('WTF');
                    debug(a, b);
                    if (p_bResult) {
                        resolve(p_oConfig, p_oCredentials);
                    } else {
                        reject();
                    }
                });
            },
            preConfirm:  function () {
                debug('2. preConfirm triggered');
                return preConfirm(p_oConfig, p_oDocument);

            },
            text: 'Please give a reason and provide credentials',
            title: 'Award ' + p_oConfig.data.badge + ' badge to ' + unslug(p_oConfig.data.subject),
            showCancelButton: true,
            showLoaderOnConfirm: true,
            type: ''
        };

        sweetAlert(oSweetAlertConfig)
            .then(createPullRequest)
            .then(successHandler)
            .catch(errorHandler)
        ;
    }
    // -------------------------- -------------------------- -------------------
    var oConfig = {
        'data': {
            'badge': '',
            'subject': '',
            'motivation': ''
        },
        'target': {
            'branch': 'gh-pages',
            'path': '',
            'repo': 'Potherca-contrib/Achievements'
        },
        'callbacks': {
            'updateContent': updateContent,
            'commitMessage': commitMessage
        },
        "logger": console
    };
    // -------------------------- -------------------------- -------------------
    var oDocument, oList, oListItem, iListCounter;

    oDocument = p_oGlobal.document;
    oList = oDocument.querySelectorAll('[data-badge]');
    iListCounter = oList.length;

    for (; iListCounter > 0; iListCounter--) {
        oListItem = oList[iListCounter-1];

        oListItem.style.cursor = 'pointer';
        oListItem.addEventListener('click', function () {
            clickHandler(oConfig, oDocument, this);
        });
    }
}(window));

/*EOF*/