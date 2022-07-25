module "acm_request_certificate" {
  source = "cloudposse/acm-request-certificate/aws"
  version = "0.16.0"

  domain_name                       = var.domain
  subject_alternative_names         = ["*.${var.domain}"]
  process_domain_validation_options = true
  ttl                               = "300"
}

module "cdn" {
  source  = "cloudposse/cloudfront-s3-cdn/aws"
  version = "0.82.4"

  name                = "${var.organization}-${var.domain}"
  aliases             = [var.domain]
  dns_alias_enabled   = true

  acm_certificate_arn = module.acm_request_certificate.arn
  depends_on          = [module.acm_request_certificate]
}

resource "null_resource" "trigger_deployment" {
  provisioner "local-exec" {
    command = <<-EOF
      yarn install
      yarn build
      aws s3 sync ./build s3://$S3_BUCKET --delete
      aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION --paths "/*"
    EOF

    environment = {
      CLOUDFRONT_DISTRIBUTION = module.cdn.cf_id
      S3_BUCKET_NAME          = module.cdn.s3_bucket
    }
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

data "aws_route53_zone" "for_domain" {
  name = "${var.domain}."
}

resource "aws_route53_record" "a_record" {
  zone_id = "${data.aws_route53_zone.for_domain.zone_id}"
  name    = var.domain
  type    = "A"

  alias {
    name = "${module.cdn.cf_domain_name}"
    zone_id = "Z2FDTNDATAQYW2" # CloudFront ZoneID (https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html)
    evaluate_target_health = false
  }
}