terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
}

resource "aws_instance" "terraform-server" {
  ami           = "ami-0ecb62995f68bb549"
  instance_type = "t2.micro"

  subnet_id = aws_subnet.main_subnet.id

  vpc_security_group_ids = [
    aws_security_group.ssh_sg.id
  ]

  key_name = aws_key_pair.deployer.key_name

  tags = {
    Name = "testing-terraform"
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = file("terraform-key.pub")
}


resource "aws_vpc" "mainvpc" {
  cidr_block = "10.1.0.0/16"
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.mainvpc.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.mainvpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "rt_assoc" {
  subnet_id      = aws_subnet.main_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_subnet" "main_subnet" {
  vpc_id                  = aws_vpc.mainvpc.id
  cidr_block              = "10.1.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}


resource "aws_security_group" "ssh_sg" {
  name   = "terraform-ssh-sg"
  vpc_id = aws_vpc.mainvpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

