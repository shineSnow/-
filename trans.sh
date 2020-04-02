unset msg

read -p "请输入commit的提交描述:" msg

git add .

git commit -m $msg

git pull 

git push

git status
