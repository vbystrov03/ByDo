FROM python:3.9

COPY . /apt

WORKDIR /apt

RUN pip install -r requirements.txt
EXPOSE 10000

ENTRYPOINT [ "python", "main.py" ]