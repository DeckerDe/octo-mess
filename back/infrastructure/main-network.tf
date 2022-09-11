resource "aws_vpc" "fargateVpc" {
  cidr_block = "10.0.0.0/16"

  enable_dns_hostnames = true
}

resource "aws_subnet" "main" {
  vpc_id = aws_vpc.fargateVpc.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_security_group" "fargate" {
  name = "fargatesg"
  vpc_id = aws_vpc.fargateVpc.id

  ingress {
    from_port = 80
    protocol  = "tcp"
    to_port   = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
}