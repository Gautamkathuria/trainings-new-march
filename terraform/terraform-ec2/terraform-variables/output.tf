output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.my_ec2.public_ip
}

output "ec2_key_name" {
  description = "Key pair name used for EC2"
  value       = aws_instance.my_ec2.key_name
}

