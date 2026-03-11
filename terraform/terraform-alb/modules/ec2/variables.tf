variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "instance_count" {
  type    = number
  default = 2
}

variable "instance_type" { type = string }
variable "ami" { type = string }
variable "name" { type = string }
