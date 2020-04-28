static_files:
	./simpleasthat.py

lambda_bundle:
	npm run build

clean:
	rm -rf site/webinar
	rm -rf functions

all: static_files lambda_bundle