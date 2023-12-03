#!/bin/bash

export ANSIBLE_HOST_KEY_CHECKING=False

ansible-playbook -i ananke.paxa.dev, playbook.yml --ask-vault-pass