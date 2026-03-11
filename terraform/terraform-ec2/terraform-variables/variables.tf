variable "region" {
  description = "AWS region"
  type = string
}

variable "ami" {
  description = "AMI ID"
  type = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "key_name" {
  description = "Name of the key pair"
  type        = string
}

variable "public_key_path" {
  description = "Path to public SSH key"
  type        = string
}

variable "allowed_ip" {
  description = "IP address allowed for SSH"
  type        = string
}


