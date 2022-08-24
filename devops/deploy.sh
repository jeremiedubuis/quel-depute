echo '$2' | docker login $3 -u $1 --password-stdin

docker pull $3/jeremie/quel-depute:latest
docker ps -a
cd /home/debian/traefik/quel-depute/production
docker compose down
docker compose up -d
exit