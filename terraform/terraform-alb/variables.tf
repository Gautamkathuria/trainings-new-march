# AWS region
variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

# EC2 instance type
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

# Number of EC2 instances
variable "instance_count" {
  description = "Number of EC2 instances"
  type        = number
  default     = 2
}

# AMI ID (Amazon Linux 2)
variable "ami" {
  description = "AMI ID for EC2 instances"
  type        = string
  default     = "ami-0f5ee92e2d63afc18"
}
