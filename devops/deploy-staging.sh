
echo '$2' | docker login $3 -u $1 --password-stdin

docker pull $3/jeremie/quel-depute:staging
docker ps -a
cd /home/debian/traefik/quel-depute/staging
docker compose down
docker compose up -d
exit