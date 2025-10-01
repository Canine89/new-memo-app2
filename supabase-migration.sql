-- 슈파베이스 마이그레이션 SQL
-- 이 파일을 슈파베이스 SQL 에디터에서 실행하세요

-- CreateEnum 타입이 필요하지 않으므로 바로 테이블 생성

-- Users 테이블 생성
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Memos 테이블 생성
CREATE TABLE "memos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);

-- 인덱스 생성
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- 외래키 제약조건 추가
ALTER TABLE "memos" ADD CONSTRAINT "memos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS (Row Level Security) 설정 (선택사항)
-- 슈파베이스에서는 RLS를 사용하여 보안을 강화할 수 있습니다

-- Users 테이블에 RLS 활성화
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Memos 테이블에 RLS 활성화
ALTER TABLE "memos" ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성 (사용자는 자신의 데이터만 접근 가능)
CREATE POLICY "Users can view own profile" ON "users"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON "users"
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view own memos" ON "memos"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own memos" ON "memos"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own memos" ON "memos"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own memos" ON "memos"
    FOR DELETE USING (auth.uid()::text = "userId");
