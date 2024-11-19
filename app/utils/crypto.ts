import JSEncrypt from 'jsencrypt'

const _pubKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqgnKvg2pME+I5kQgeRwos3VdecJfqNKf/OyEXY9tPsrLbqIzly/ZZ6WpqjALQSIW008ZyX/3qm23DEZ8RB233L9hlgnBvQx/grImeHaRG0Lli4MYWcdgEfPp23qOL+uqYmkS2dfj7zjKdORDeOTt++mPJlTLimzpZuTXZcZlkmiG/rDYCP3lKsTiI5s3eBBoCXu/RTyBe4La2+yWXJ25G2Tnb2H96ZiNqwKOOeBRCjwiuiJFUyb88N1SDX8Wh21lNHQCVLW17wSRngjwkE22dmLFlOlJ2Hq6WtriGVcijtFwH9GceFgBU4V69nsHZDaxicxVff8tZsYxUKH5VKhyIQIDAQAB'

export const rsaEncrypt = (data: string) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(_pubKey)

  const encrypted = encrypt.encrypt(data)
  if (encrypted) {
    return encrypted
  }
}