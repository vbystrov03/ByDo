FROM python

COPY . /apt

WORKDIR /apt

RUN pip install requirements.txt
EXPOSE 10000

ENTRYPOINT [ "python", "main.py" ]