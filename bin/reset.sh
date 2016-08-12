#!/usr/bin/env bash

declare -a aFiles
declare sContent

readonly sSourceFile='empty.md'
readonly sTargetPath="$(dirname $(readlink -f $0))/../_profiles"

function abort(){
    echo 'Aborting.'
    exit 0
}

function confirm(){
    echo -e "$1"
    read -s -r -n 1 -p $'Continue? [y/n]\n' sContinue
    if [[ ! "${sContinue}" =~ ^(y|Y|)$ ]];then
        abort
    fi
}

function buildFileList(){
    for sFile in ${sTargetPath}/*;do
        if [[ "${sFile}" != "${sSourceFile}" ]];then
            aFiles+=("${sFile}")
        fi
    done
}

function getContent(){
    cat "${sTargetPath}/${sSourceFile}"
}

function resetFiles(){
    local sContent="$1"
    for sFile in "${aFiles[@]}";do
        echo -e "${sContent}" > "${sFile}"
    done
}

function run(){
    buildFileList
    confirm "The following files will be rest to zero:\n$(printf '%s\n' "${aFiles[@]}")\n"
    sContent=$(getContent)
    resetFiles "$sContent"
}

run

#EOF