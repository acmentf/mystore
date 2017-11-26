#!/bin/sh

now="$(date +'%Y%m%d%H%M%S')"
devBranch="build"
releaseBranch="tuyi_publish_branch"
masterBranch="master"

mergeRelease() {
    git checkout ${devBranch}
    git pull
    git push
    git checkout ${releaseBranch}
    git pull
    git merge --no-ff ${devBranch}
    git push
}

mergeBuildRelease() {
    mergeRelease
    npm run build
    git add .
    git commit -m "Update dist build ${now}"
    git push
}

mergeMaster() {
    git checkout ${masterBranch}
    git pull
    git branch "${masterBranch}_bak_${now}"
    git merge --no-ff ${releaseBranch}
    git push
    git tag "v${now}"
    git tag
}

echo 'a、推送代码到生产环境'
echo 'b、构建后推送代码到生产环境'
echo 'c、合并生产环境代码到master分支'
echo '请根据字母选择您的操作：'

read isOk

case $isOk in
    a)
        mergeRelease
        break
        ;;
    b)
        mergeBuildRelease
        break
        ;;
    c)
        mergeMaster
        break
        ;;
    *)
        echo '无效的选择'
        break
        ;;
esac
